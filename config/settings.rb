module Settings
  LOG_PATH = File.join(File.dirname(__FILE__), '../log')
  API_URL = 'https://api.cc.ncu.edu.tw/bus_dev/v1'
  OAUTH_ACCESS_TOKEN_ENDPOINT = 'https://oauth.apitest.cc.ncu.edu.tw/oauth/token'
  OAUTH_APP_ID = '94818362b09b0c62ae8b72d94b435ae766f0fd6cbe32a56b16dca6c8dba32e63'
  OAUTH_SECRET = 'efb2c0fba4f12dfe6b9f1c50e42b153c32d8e4471d9269762ffdcf1b620801cd'
  STATIC_FILE_DIR = File.join(File.dirname(__FILE__), '../static')
  TMP_DIR = File.join(File.dirname(__FILE__), '../tmp')
end
