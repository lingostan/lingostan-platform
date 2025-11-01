import { UserLang } from '../lang/model';

export type User = {
  email: string;
  name: string;
  languages: UserLang[];
  createdAt: Date;
  age: number;
  id: string;
  avatarUrl: string;
};
