#
# Simple Vagrantfile, with Chef-solo provisioning
#

Vagrant::Config.run do |config|
  config.vm.box = "precise64"

  # Booting

  # Networking
  # config.vm.network :hostonly, "192.168.33.10"
  # config.vm.network :bridged

  # Port forwarding
  config.vm.forward_port 6001, 6001
  config.vm.forward_port 6002, 6002
  # setup rabbitmq monitoring
  config.vm.forward_port 15672, 15672

  # Provisioning
  # Needs build-essential cookbook from https://github.com/opscode/cookbooks
  # config.vm.provision :shell, :path => "./Vagrantdata/setup.sh"

  config.vm.provision :chef_solo do |chef|
  			chef.cookbooks_path = "cookbooks"


  			chef.json = {
                  "nodejs" => {
                    :version => "0.10.33"
                  }
                }

  			chef.add_recipe "apt"
  			chef.add_recipe "build-essential"
  			chef.add_recipe "mongodb::10gen_repo"
  			chef.add_recipe "nodejs"
  			chef.add_recipe "redis"
  			chef.add_recipe "rabbitmq"
  		end
end
