import type { OAuthConfig, OAuthUserConfig } from 'next-auth/providers'

export interface LabshareProfile extends Record<string, any> {
  sub: string
  nickname: string
  email: string
  picture: string
}

export default function Labshare<P extends LabshareProfile>(
  options: OAuthUserConfig<P>
): OAuthConfig<P> {
  return {
    id: "labshare",
    name: "Labshare Auth",
    wellKnown: `${options.issuer}/.well-known/openid-configuration`,
    type: "oauth",
    authorization: { params: { scope: "openid email profile" } },
    checks: ["pkce", "state"],
    idToken: true,
    profile(profile) {
      return {
        id: profile.sub,
        name: profile.nickname,
        email: profile.email,
        image: profile.picture,
      }
    },
    style: {
      logo: `${process.env.NEXTAUTH_URL}/labshare_logo.png`,
      logoDark: `${process.env.NEXTAUTH_URL}/labshare_logo.png`,
      bg: "#fff",
      text: "#EB5424",
      bgDark: "#EB5424",
      textDark: "#fff",
    },
    options,
  }
}
