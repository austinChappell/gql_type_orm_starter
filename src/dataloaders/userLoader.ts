// External Dependencies
import DataLoader from 'dataloader';
import { default as sort } from 'dataloader-sort';

// Internal Dependencies
import { User } from '../models/User';

export const userLoader = new DataLoader(async (keys: readonly string[]) => {
  const users = await User.findByIds([...keys]);
  return sort(keys, users);
});
