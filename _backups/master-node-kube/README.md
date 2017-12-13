## Running Sentinel-Nodes on Kubernets@GCP :=

### First Install gcloud sdk on your machine:

	`$ curl https://sdk.cloud.google.com | bash`

### Restart Your Terminal and Enter:

	`$ gcloud init`
	`$ gcloud components install kubectl`
	`$ gcloud auth login`

Once You Have Logged Into the Gcloud Via Terminal, You Can Proceed Further.

### Now Running Sentinel-Nodes on Kubernetes(Config Files in Sentinel-Kube Directory):

	`$ gcloud container clusters create 'Cluster-Name' --num-nodes=3`
	`$ kubectl create \
	   > -f geth-configMap.yml \
	   > -f geth-Service.yml \
	   > -f geth-daemonSet.yml`

Note: Number of Nodes can be set accroding to your wish.

### Now If You Want to Check What's Happening inside the containers, You Can Do:

	`$ kubectl get pods`
	`$ kubectl exec 'pod-name' -i -t sh `
	`$ cd var/geth && geth attach ipc:geth.ipc`
	`> admin.peers`

### To Start Mining on Sentinel Network, Just Do:

	`> var SomeName = personal.newAccount('your-password')`
	`> eth.defaultAccount = SomeName`
	`> miner.setEtherbase = SomeName`
	`> miner.start(2)`
	`> miner.getHashrate()`

`Note 1: miner.start() takes number of threads as argument for mining.`<br />
`Note 2: miner.getHashrate() gives you hashing rate of your computer.`
