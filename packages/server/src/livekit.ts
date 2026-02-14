import { AccessToken } from 'livekit-server-sdk';

export async function generateLiveKitToken(identity: string): Promise<string> {
  const apiKey = process.env.LIVEKIT_API_KEY;
  const apiSecret = process.env.LIVEKIT_API_SECRET;
  
  if (!apiKey || !apiSecret) {
    throw new Error('LiveKit credentials not configured');
  }

  const token = new AccessToken(apiKey, apiSecret, { identity });
  token.addGrant({
    roomJoin: true,
    room: 'excali-discover',
    canPublish: true,
    canSubscribe: true,
  });

  return await token.toJwt();
}
