#require './app/helpers/oauth.rb'
require './app/api/v2.rb'
require 'grape_logging'

module Bus
	class API < Grape::API
		logger.formatter = GrapeLogging::Formatters::Default.new
		logger Logger.new GrapeLogging::MultiIO.new(STDERR, File.open(Settings::LOG_PATH, 'a'))
		use GrapeLogging::Middleware::RequestLogger, { logger: logger }
		mount Bus::V2 => '/'
	end
end
