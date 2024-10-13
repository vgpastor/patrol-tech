export interface JwtPayload{
  iss?: string;
  sub?: string;
  aud?: string[] | string;
  exp?: number;
  nbf?: number;
  iat?: number;
  jti?: string;
  id: string;
  name: string;
  email: string;
  organizationId: string;
}
