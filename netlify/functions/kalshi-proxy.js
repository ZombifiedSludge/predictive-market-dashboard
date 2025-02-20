const crypto = require('crypto');

const PRIVATE_KEY = `-----BEGIN RSA PRIVATE KEY-----
MIIEowIBAAKCAQEAulgAOOLKWQou0+TFy6iP8Q+sYWLFBKwbn1eLe9qUxtyyABxj
eq+ZTqBqD8bmaCLfjSvqEYgI2wcsMAcZ8XsfCx14J1qHCjzPTbWDDiNMbeBZEarE
sCbiZB9kjGYrDN4ifHBY7jU+NXvUrZ7UGLpSdyL4hDSWtUVd2BYsf9N4VkfofX0r
5F1QU2CZaqV/Emvua45/FLI3jis5NbDP+K0vSHOt1ztXTPoBVa9i7PoRKfsvnAfF
1Q+NhhBOd6I9/E0ShScQ6roR+98CWMCylsuD9zEz85c57mVWk+AtRhTuDUkbd4VJ
yDUQajaa/8ngfaPA6vEfrz+xxoQXy/cCwII87QIDAQABAoIBADO5H36qvL3QTMU2
GAz6odGopxF1B/jPCO/GrgnX1zoHokTTnG0+dpBTiH0OmX/IRkL6MINjPgoFyKcg
IXxcz3YXXPWXdCpMTMJmIpV3CMzq2+5Cd0vpzyc5a4BpD4QH2Iyv5o9gKf9Qeu0i
S/79IMy+4TpZGogAVBcZuIpWmW1hGPftMLyGeBiaF0PI8/ddct/2tCM+Lk2cFcb0
d1i7z+HUM72f14VSa/7dUUQGrWj0nomn7ziY52yXp2CrhyKfDHCgPe8xEXgzu7Gf
eTMnm3LAYZ/8D3tHHiiJm4FDGoXMGo0j5V0zarbuihWSGyQSV4qx2hhBTdaAjk2B
TWJij0UCgYEA0fMwnUERavYVDk2XoLftIy7vR+mgYuc+jP00qdV52EmyiPRMRi4i
2aO9/g7hCnfAXUajAbIraMbdlLny0e9ZKRjmnsdyRm3uX3z7InjKebpmRjGR/Kft
EzP9tikk6t+Y/1PHGqCrbHoL21Jut1V5GKeeXYG4Ll+1DFQXptu8SocCgYEA4zdP
GFTAtM/cIVRNITWXH19xt2a0wko08heNC9i14qjaMyxCbsJarQSErdhCIH86rIen
xNi2EY77uqaxA9pQ4GDp2PLBz9fHEPlO8e3V0+WgqZyegCxMwfqpXvc95RP0MI5T
H+Xnns+K3cqnNvlW3ZzgrCqVHtbk0Xyw5E59VesCgYEAvBOEKEtC5DPAVwjRXUuG
5q7D8gLrB86p7Tli9QVk2onioudecLwhwh/6Ml534J24OJbvrbRDSOBlXTdavBAT
KkrBRdnbmBYgpW/btVzJ3VRLDHSZl+GC8mHv1UB0bueRMqGFSmhGSK3oczgcMKYk
Dh8SMifjq79W+81VRsevnH8CgYB0x1F0jOK6S3a0/pHhtpxkOHbGrxfKH7+UiXwp
kYjx5Jy43k+Kg4N9Fyxl+RcLgriSQep9JnB1F8rTRKcH9uXIXKbzpNjtzNX4KFpl
xzo1/PgVFHT2JU6SCBWSxHngSeAgMJYSd+QSYFLb6TMF8yKtJdrnQb+AqSvTa0Wz
IZATXwKBgHqgCJnomkMfhGlX7v9B7FnKV1i1d98dOleEXNllCdtrteHFF88QvQqa
xlRwr3KdohKYs8gMXB/CXyCG5OA7CWV0P40Cg/6jBLxnAZliHeIqCFThSDZX2++/
ENWzPcnnWu2NykNcZVzCDE7u1YL8GIQpp+hCt8rIMuTBO2bZJnhf
-----END RSA PRIVATE KEY-----`;

const ACCESS_KEY = '731c0410-6dbe-47a2-ac7f-bab9a4be1e0b';

exports.handler = async function(event) {
  try {
    const timestamp = Date.now().toString();
    const method = 'GET';
    const path = '/trade-api/v2/markets?series=SP500Y25';
    
    // Generate signature
    const message = `${timestamp}${method}${path}`;
    const signature = crypto.createSign('SHA256')
      .update(message)
      .sign(PRIVATE_KEY, 'base64');

    // Make request to Kalshi
    const response = await fetch('https://demo-api.kalshi.co' + path, {
      headers: {
        'KALSHI-ACCESS-KEY': ACCESS_KEY,
        'KALSHI-ACCESS-SIGNATURE': signature,
        'KALSHI-ACCESS-TIMESTAMP': timestamp
      }
    });

    const data = await response.json();

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify(data)
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message })
    };
  }
};
