module Bus
	class V2 < Grape::API
	format :txt	
		
		helpers do
			def getAcssTkn (id , secret)
				savedRes = File.read(Settings::TMP_DIR + "/accessToken")
				savedRes = JSON.parse savedRes
				if  savedRes['expires_in'] + savedRes['created_at'] - Time.new.to_i < 300
					authCode = Base64.encode64(URI.escape(id) + ":" + URI.escape(secret)).gsub(' ','').gsub("\n",'')
					url = Settings::OAUTH_ACCESS_TOKEN_ENDPOINT + "?grant_type=client_credentials"
					response = RestClient::Request.execute(:url => url, :method => :post, :verify_ssl => false, :headers => {:Authorization=>"Basic #{authCode}"})
					res = JSON.parse response.body
					f = File.open(Settings::TMP_DIR + "/accessToken", "w")
					f.write(response.body)
					f.close
					res['access_token']
				else
					savedRes['access_token']
				end
			end
		end
		
		rescue_from :all do |e|
			V2.logger.error e
			error! 'server_error', 500
		end
		
		
		desc 'NCU_BUS WebApp, serve a webApp with access Token' do
		end
		params do
		end
		content_type :html, "text/html; charset=utf-8"
		get :index do
			access_token = getAcssTkn(Settings::OAUTH_APP_ID, Settings::OAUTH_SECRET)
			header 'Content-Type', 'text/html; charset=UTF-8'
			raw = File.read(Settings::STATIC_FILE_DIR + "/index.html")
			raw = raw.gsub('Your access token here', access_token)
			ERB.new(raw).result(binding)
		end
		
        desc 'Refresh AccessToken' do
        end
        params do
        end
        content_type :txt, 'text/plain'
        get :accessToken do
            accessToken = getAcssTkn(Settings::OAUTH_APP_ID, Settings::OAUTH_SECRET)
        end
        
		
		add_swagger_documentation api_version: 'v2',
                                hide_documentation_path: true,
                                hide_format: true,
                                mount_path: '/doc',
                                base_path: "#{Settings::API_URL}/bus/v2"

	end
end
