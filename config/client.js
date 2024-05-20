export default {
  resourceServerUrl: "https://api.moneyhub.co.uk/v2.0",
  identityServiceUrl: "https://identity.moneyhub.co.uk",
  accountConnectUrl: "https://bank-chooser.moneyhub.co.uk/account-connect.js",
  client: {
    client_id: "CLIENT_ID",
    client_secret: "CLIENT_SECRET",
    token_endpoint_auth_method: "client_secret_basic",
    id_token_signed_response_alg: "RS256",
    request_object_signing_alg: "none",
    redirect_uri: "REDIRECT_URI",
    response_type: "code",
    keys: [/* your jwks */],
  },
}
