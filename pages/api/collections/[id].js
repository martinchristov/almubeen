import { createClient } from '@supabase/supabase-js'
import { getServerSession } from "next-auth/next"
import { authOptions } from '../auth/[...nextauth]'

export default async function handler(req, res) {
  const id = Number(req.query.id);

  const session = await getServerSession(req, res, authOptions)

  if (!session) {
    res.status(401).json({ message: "You must be logged in." });
    return;
  }

  const { supabaseAccessToken, user } = session

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      global: {
        headers: {
          Authorization: `Bearer ${supabaseAccessToken}`,
        },
      },
    }
  )

  if(req.method === 'POST'){
    if(!req.body.key){
      return res.json({ message: 'Error', error: 'No key' })
    }
    
    await supabase
      .from('ayat')
      .insert({ key: req.body.key, coll_id: id })
    return res.json({
      message: 'Success',
      // error
    })
  }
  else if(req.method === 'DELETE'){
    if(!req.body.key){
      return res.json({ message: 'Error', error: 'No key' })
    }
    
    const res = await supabase
      .from('ayat')
      .delete()
      .eq('key', req.body.key)
      .eq('coll_id', id)
    
    return res.json({
      message: 'Success',
      // error
    })
  }
}