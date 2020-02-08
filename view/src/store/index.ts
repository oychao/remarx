import * as dataJson from './data.json';

export const data = (dataJson as unknown) as { default: typeof dataJson };
