module Settings
	LOG_PATH = File.join(File.dirname(__FILE__), '../log')
    API_URL = 'bus.webapp.cc.ncu.edu.tw'
	OAUTH_ACCESS_TOKEN_ENDPOINT = 'https://oauth.apitest.cc.ncu.edu.tw/oauth/token'
	OAUTH_APP_ID = ''
	OAUTH_SECRET = ''
	STATIC_FILE_DIR = File.join(File.dirname(__FILE__), '../public')
	TMP_DIR = File.join(File.dirname(__FILE__), '../tmp')
end
