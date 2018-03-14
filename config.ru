# config.ru


require File.expand_path('../environment', __FILE__)
require File.expand_path('../app', __FILE__)

use Rack::Cors do
  allow do
    origins '*'
    resource '*', headers: :any, methods: [ :get, :post, :put, :delete, :options ]
  end
end

use Rack::Static, urls: ["/bus/v2/public"], root: "public"

run Bus::API 