import { createClient } from '@supabase/supabase-js';

type ProjectRow = {
  id: string;
  name: string;
  genre: string;
  info: string;
  link: string;
  image_gradient: string;
};

type ProjectBody = {
  id?: string;
  name?: string;
  genre?: string;
  info?: string;
  link?: string;
  imageGradient?: string;
};

const fallbackUsername = 'admin';
const fallbackPassword = 'password123';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const toClientProject = (project: ProjectRow) => ({
  id: project.id,
  name: project.name,
  genre: project.genre,
  info: project.info,
  link: project.link,
  imageGradient: project.image_gradient,
});

const readBody = (body: unknown): ProjectBody => {
  if (!body) {
    return {};
  }

  if (typeof body === 'string') {
    return JSON.parse(body);
  }

  return body as ProjectBody;
};

const isAuthorized = (req: { headers: Record<string, string | string[] | undefined> }) => {
  const username = req.headers['x-admin-username'];
  const password = req.headers['x-admin-password'];
  const expectedUsername = process.env.ADMIN_USERNAME || fallbackUsername;
  const expectedPassword = process.env.ADMIN_PASSWORD || fallbackPassword;

  return username === expectedUsername && password === expectedPassword;
};

const getSupabase = () => {
  if (!supabaseUrl || !supabaseServiceRoleKey) {
    throw new Error('Missing Supabase environment variables');
  }

  return createClient(supabaseUrl, supabaseServiceRoleKey);
};

const validateProject = (body: ProjectBody) => {
  if (!body.name || !body.genre || !body.info) {
    throw new Error('Project name, genre, and info are required');
  }
};

export default async function handler(req: any, res: any) {
  try {
    const supabase = getSupabase();

    if (req.method === 'GET') {
      const { data, error } = await supabase
        .from('projects')
        .select('id, name, genre, info, link, image_gradient')
        .order('created_at', { ascending: true });

      if (error) {
        throw error;
      }

      return res.status(200).json((data || []).map(toClientProject));
    }

    if (!isAuthorized(req)) {
      return res.status(401).send('Unauthorized');
    }

    const body = readBody(req.body);

    if (req.method === 'POST') {
      validateProject(body);

      const { data, error } = await supabase
        .from('projects')
        .insert({
          name: body.name,
          genre: body.genre,
          info: body.info,
          link: body.link || '',
          image_gradient: body.imageGradient || 'from-neutral-700 to-neutral-800',
        })
        .select('id, name, genre, info, link, image_gradient')
        .single();

      if (error) {
        throw error;
      }

      return res.status(201).json(toClientProject(data));
    }

    if (req.method === 'PUT') {
      if (!body.id) {
        return res.status(400).send('Project id is required');
      }

      validateProject(body);

      const { data, error } = await supabase
        .from('projects')
        .update({
          name: body.name,
          genre: body.genre,
          info: body.info,
          link: body.link || '',
          image_gradient: body.imageGradient || 'from-neutral-700 to-neutral-800',
        })
        .eq('id', body.id)
        .select('id, name, genre, info, link, image_gradient')
        .single();

      if (error) {
        throw error;
      }

      return res.status(200).json(toClientProject(data));
    }

    if (req.method === 'DELETE') {
      if (!body.id) {
        return res.status(400).send('Project id is required');
      }

      const { error } = await supabase.from('projects').delete().eq('id', body.id);

      if (error) {
        throw error;
      }

      return res.status(200).json({ ok: true });
    }

    res.setHeader('Allow', 'GET, POST, PUT, DELETE');
    return res.status(405).send('Method not allowed');
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unexpected server error';
    return res.status(500).send(message);
  }
}
