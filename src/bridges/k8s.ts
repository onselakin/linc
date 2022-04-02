import { Bridge } from '../ipc/ipc-handler';
import * as k8s from '@kubernetes/client-node';
import Context from '../types/context';

const getContexts: Bridge<void, Context[]> = async (_payload, channel) => {
  const kc = new k8s.KubeConfig();
  kc.loadFromDefault();

  const result = kc.getContexts().map(c => {
    const cluster = kc.getCluster(c.cluster);
    return {
      name: c.name,
      user: c.user,
      cluster: c.cluster,
      namespace: c.namespace,
      server: cluster?.server,
    };
  });

  channel.reply(result);
};

const getConfig: Bridge<{ context: string }, string> = async ({ context }, channel) => {
  const kc = new k8s.KubeConfig();
  kc.loadFromDefault();

  const ctx = kc.getContexts().find(c => c.name === context);
  const user = kc.getUser(ctx!.user);
  const cluster = kc.getCluster(ctx!.name);

  const cfg = new k8s.KubeConfig();
  cfg.addContext(ctx!);
  cfg.addUser(user!);
  cfg.addCluster(cluster!);
  cfg.currentContext = ctx!.name;

  channel.reply(cfg.exportConfig());
};

export default {
  'k8s:contexts': getContexts,
  'k8s:getConfig': getConfig,
};
