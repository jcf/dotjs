require 'erb'

desc 'Install dotjs'
task install: 'install:all'

DAEMON_INSTALL_DIR = ENV['PREFIX'] || '/usr/local/bin'

def ask(question)
  print "#{question} (y/n) "
  answer = $stdin.gets.chomp.downcase
  ask(question) unless answer == 'y' || answer == 'n'
  answer
rescue Interrupt
  exit 1
end

def download(url, target)
  require 'net/http'
  open(target, 'w') do |f|
    f.write Net::HTTP.get(URI(url))
  end
end

namespace :install do
  task all: [:prompt, :daemon, :create_dir, :agent, :chrome, :done]

  task :prompt do
    puts '\e[1m\e[32mdotjs\e[0m'
    puts '\e[1m-----\e[0m'
    puts 'I will install:', ''
    puts "1. djsd(1) in #{DAEMON_INSTALL_DIR}"
    puts '2. com.github.dotjs in ~/Library/LaunchAgents', ''

    answer = ask 'Install dotjs?'
    exit 1 if answer =~ /n/
  end

  task :done do
    if system('curl -k https://localhost:3131 &> /dev/null')
      puts '\e[1m\e[32mdotjs installation worked\e[0m'
      puts 'Open https://localhost:3131 in Chrome to enable HTTPS support'
    else
      puts '\e[31mdotjs installation failed\e[0m'
      puts 'Output from the installation process can be found via Console.app.'
    end
  end

  desc 'Install launch agent'
  task :agent do
    plist = 'com.github.dotjs.plist'
    agent_dir = File.expand_path('~/Library/LaunchAgents/')
    agent = File.join(agent_dir, plist)
    Dir.mkdir(agent_dir) unless File.exist?(agent_dir)
    File.open(agent, 'w') do |f|
      f.puts ERB.new(IO.read(plist)).result(binding)
    end

    chmod 0644, agent
    puts 'starting djdb...'
    sh "launchctl load -w #{agent}"
    # wait for server to start
    sleep 5
  end

  desc 'Install dotjs daemon'
  task daemon: :install_dir_writeable do
    cp 'bin/djsd', DAEMON_INSTALL_DIR, verbose: true, preserve: true
  end

  desc 'Create ~/.js'
  task :create_dir do
    js_dir = File.join(ENV['HOME'], '.js')
    unless File.directory? js_dir
      mkdir js_dir
      chmod 0755, js_dir
    end
  end

  desc 'Install Google Chrome extension'
  task :chrome do
    puts '', '\e[31mIMPORTANT!\e[0m Install the Google Chrome extension:'
    puts 'http://bit.ly/dotjs', ''
  end
end

desc 'Uninstall dotjs'
task uninstall: 'uninstall:all'

namespace :uninstall do
  task all: [:prompt, :daemon, :agent, :chrome, :done]

  task :prompt do
    puts '\e[1m\e[32mdotjs\e[0m'
    puts '\e[1m-----\e[0m'
    puts 'I will remove:', ''
    puts '1. djsd(1) from #{DAEMON_INSTALL_DIR}'
    puts '2. com.github.dotjs from ~/Library/LaunchAgents'
    puts '3. The dotjs Google Chrome Extension', ''
    puts 'I will not remove:', ''
    puts '1. ~/.js', ''

    answer = ask 'Uninstall dotjs?'
    exit 1 if answer =~ /n/
  end

  task :done do
    if system('curl http://localhost:3131 &> /dev/null')
      puts '\e[31mdotjs uninstall failed\e[0m'
      puts 'djsd is still running'
    else
      puts '\e[1m\e[32mdotjs uninstall worked\e[0m'
      puts 'your ~/.js was not touched'
    end
  end

  desc 'Uninstall launch agent'
  task :agent do
    agent = File.expand_path('~/Library/LaunchAgents/com.github.dotjs.plist')
    sh 'launchctl unload #{agent}'
    rm agent, verbose: true
  end

  desc 'Uninstall dotjs daemon'
  task daemon: :install_dir_writeable do
    rm File.join(DAEMON_INSTALL_DIR, 'djsd'), verbose: true
  end

  desc 'Uninstall Google Chrome extension'
  task :chrome do
    puts '\e[1mplease uninstall the google chrome extension manually:\e[0m'
    puts 'google chrome > window > extensions > dotjs > uninstall'
  end
end

# Check write permissions on DAEMON_INSTALL_DIR
task :install_dir_writeable do
  unless File.writable?(DAEMON_INSTALL_DIR)
    abort "Error: Can't write to #{DAEMON_INSTALL_DIR}. Try again using `sudo`."
  end
end

JQUERY_VERSION = '2.1.3'
namespace :jquery do
  desc 'Download version #{JQUERY_VERSION} of jQuery'
  task :download do
    download "http://code.jquery.com/jquery-#{JQUERY_VERSION}.min.js",
             'ext/jquery.js'
  end
end

namespace :daemon do
  desc 'Reload djsd'
  task :reload => 'install:daemon' do
    sh 'launchctl unload ~/Library/LaunchAgents/com.github.dotjs.plist'
    sh 'launchctl load ~/Library/LaunchAgents/com.github.dotjs.plist'
  end
end
