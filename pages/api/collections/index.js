import { createClient } from '@supabase/supabase-js'
import { getServerSession } from "next-auth/next"
import { authOptions } from '../auth/[...nextauth]'

export default async function handler(req, res) {
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
    
    // CREATE COLLECTION
    // --
    
    return res.json({
      message: 'Success',
      // error
    })
  }

  const { data, error } = await supabase.from("collections").select("*").eq('uid', session.uid)
  const resp = []
  for(let item of data){
    const keys = await supabase.from('ayat').select('key').eq('coll_id', item.id)
    resp.push({...item, keys: keys.data.map(it => it.key) })
  }

  return res.json({
    message: 'Success',
    data: resp,
    error
  })
}