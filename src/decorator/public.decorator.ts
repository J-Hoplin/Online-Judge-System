import { SetMetadata } from '@nestjs/common';

/**
 * Set metadata as allow-public true
 *
 */
export const AllowPublicToken = 'allow-public';
export const AllowPublic = () => SetMetadata(AllowPublicToken, true);
