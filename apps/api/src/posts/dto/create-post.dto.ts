export class CreatePostDto {
  title: string;
  content: string;
  skills: string[]; // Array of skill IDs
  mediaIds?: string[];
}
