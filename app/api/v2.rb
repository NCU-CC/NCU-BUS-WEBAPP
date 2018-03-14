module Bus

	class V2 < Grape::API
		format :txt	

		helpers do

			def getAccessToken (id , secret)
				cache = JSON.parse(File.read(Settings::TMP_DIR + "/accessToken"))
				cacheExpired = (cache['expires_in'] + cache['created_at'] - Time.new.to_i < 300)

				if !cacheExpired
					cache['access_token']
					
				else
					response = RestClient::Request.execute(
						url: Settings::OAUTH_ACCESS_TOKEN_ENDPOINT,
						method: :post,
						payload: 'grant_type=client_credentials',
						verify_ssl: false,
						headers: {
							Authorization: 'Basic ' + Base64.strict_encode64(Settings::OAUTH_APP_ID + ':' + Settings::OAUTH_SECRET)
						}
					)

					file = File.open(Settings::TMP_DIR + "/accessToken", "w")
					file.write(response.body)
					file.close()

					data = JSON.parse(response.body)
					data['access_token']
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
			accessToken = getAccessToken()
			header 'Content-Type', 'text/html; charset=UTF-8'
			raw = File.read(Settings::STATIC_FILE_DIR + "/index.html")
			raw = raw.gsub('Your access token here', accessToken)
			ERB.new(raw).result(binding)
		end



		desc 'Refresh AccessToken' do
		end
		
		params do
		end
		
		content_type :txt, 'text/plain'
		
		get :accessToken do
			accessToken = getAccessToken()
		end


		add_swagger_documentation api_version: 'v2',
		hide_documentation_path: true,
		hide_format: true,
		mount_path: '/doc',
		base_path: "#{Settings::API_URL}/bus/v2"

	end
end
