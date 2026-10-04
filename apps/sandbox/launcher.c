/*
 * DEV-TO-DEV sandbox launcher.
 *
 * This tiny program is the only component that ever launches learner Python
 * code. It is exec'd (never shell-invoked) and, before starting the Python
 * interpreter, it:
 *
 *   1. lowers resource limits (CPU, memory, process count, file size, fds),
 *   2. sets no-new-privileges (already set by the container, kept for safety),
 *   3. installs a seccomp-BPF filter that DENIES `socket` and `socketpair`
 *      with EPERM (blocking all TCP/UDP/unix/DNS/localhost/private/metadata
 *      networking at the syscall level), and
 *   4. exec's the Python interpreter with the learner's script.
 *
 * The learner process remains the container's non-root uid (10001) and gains
 * no privileges. No shell is ever used and no learner code is ever
 * interpolated into a command string.
 */

#include <errno.h>
#include <linux/audit.h>
#include <linux/filter.h>
#include <linux/seccomp.h>
#include <stddef.h>
#include <stdio.h>
#include <string.h>
#include <sys/prctl.h>
#include <sys/resource.h>
#include <sys/syscall.h>
#include <unistd.h>

#define MAX_CPU_SECONDS 4
#define MAX_MEMORY_BYTES (256 * 1024 * 1024)
#define MAX_PROCESSES 32
#define MAX_FILE_BYTES 20000
#define MAX_OPEN_FILES 64

static int set_limits(void) {
    struct rlimit rl;

    rl.rlim_cur = MAX_CPU_SECONDS;
    rl.rlim_max = MAX_CPU_SECONDS;
    if (setrlimit(RLIMIT_CPU, &rl) != 0) return -1;

    rl.rlim_cur = MAX_MEMORY_BYTES;
    rl.rlim_max = MAX_MEMORY_BYTES;
    if (setrlimit(RLIMIT_AS, &rl) != 0) return -1;

    rl.rlim_cur = MAX_PROCESSES;
    rl.rlim_max = MAX_PROCESSES;
    if (setrlimit(RLIMIT_NPROC, &rl) != 0) return -1;

    rl.rlim_cur = MAX_FILE_BYTES;
    rl.rlim_max = MAX_FILE_BYTES;
    if (setrlimit(RLIMIT_FSIZE, &rl) != 0) return -1;

    rl.rlim_cur = MAX_OPEN_FILES;
    rl.rlim_max = MAX_OPEN_FILES;
    if (setrlimit(RLIMIT_NOFILE, &rl) != 0) return -1;

    return 0;
}

static int install_seccomp_filter(void) {
    struct sock_filter filter[] = {
        /* Load the architecture and validate it. */
        BPF_STMT(BPF_LD | BPF_W | BPF_ABS, offsetof(struct seccomp_data, arch)),
        BPF_JUMP(BPF_JMP | BPF_JEQ | BPF_K, AUDIT_ARCH_X86_64, 1, 0),
        BPF_STMT(BPF_RET | BPF_K, SECCOMP_RET_KILL_PROCESS),
        /* Load the syscall number. */
        BPF_STMT(BPF_LD | BPF_W | BPF_ABS, offsetof(struct seccomp_data, nr)),
        /* Deny socket(2) with EPERM. */
        BPF_JUMP(BPF_JMP | BPF_JEQ | BPF_K, __NR_socket, 0, 1),
        BPF_STMT(BPF_RET | BPF_K, SECCOMP_RET_ERRNO | EPERM),
        /* Deny socketpair(2) with EPERM. */
        BPF_JUMP(BPF_JMP | BPF_JEQ | BPF_K, __NR_socketpair, 0, 1),
        BPF_STMT(BPF_RET | BPF_K, SECCOMP_RET_ERRNO | EPERM),
        /* Allow everything else. */
        BPF_STMT(BPF_RET | BPF_K, SECCOMP_RET_ALLOW),
    };

    struct sock_fprog prog = {
        .len = (unsigned short)(sizeof(filter) / sizeof(filter[0])),
        .filter = filter,
    };

    if (prctl(PR_SET_NO_NEW_PRIVS, 1, 0, 0, 0) != 0) {
        return -1;
    }

    if (prctl(PR_SET_SECCOMP, SECCOMP_MODE_FILTER, &prog) != 0) {
        return -1;
    }

    return 0;
}

int main(int argc, char **argv) {
    if (argc < 3) {
        fprintf(stderr, "usage: sandbox_launcher <interpreter> <script> [args...]\n");
        return 2;
    }

    if (set_limits() != 0) {
        fprintf(stderr, "sandbox_launcher: failed to set resource limits\n");
        return 2;
    }

    if (install_seccomp_filter() != 0) {
        fprintf(stderr, "sandbox_launcher: failed to install seccomp filter\n");
        return 2;
    }

    /* argv[1] is the interpreter; exec it with the remaining args. */
    execv(argv[1], &argv[1]);

    fprintf(stderr, "sandbox_launcher: exec failed: %s\n", strerror(errno));
    return 2;
}
