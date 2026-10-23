import { route } from './routing';

interface Env {
  ASSETS: Fetcher;
}

export default {
  fetch(request, env) {
    if (new URL(request.url).pathname === '/api/route') return route(request);
    return env.ASSETS.fetch(request);
  },
} satisfies ExportedHandler<Env>;
