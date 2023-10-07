import { isInternalRouting } from './storage';
import { navigate } from './transitions';
import tryCatch from './try-catch';

export default async function goBack() {
  if (isInternalRouting()) {
    tryCatch(() => history.back());
  } else {
    await navigate('/', { history: 'replace' });
  }
}
