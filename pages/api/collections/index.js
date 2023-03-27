import { createClient } from '@supabase/supabase-js'
import { getServerSession } from "next-auth/next"
import { authOptions } from '../auth/[...nextauth]'

export default async function handler(req, res) {
  const session = await getServerSession(req, res, authOptions)

  if (!session) {
    res.status(401).json({ message: "You must be logged in." });
    return;
  }

  const { supabaseAccessToken, user, ...props } = session
  // console.log('has access token', supabaseAccessToken)

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
    console.log(session)
    const { data, error } = await supabase
      .from('collections')
      .select('id')
      .eq('uid', session.uid)
      .eq('title', 'Bookmarks')
    
    if(!error && data.length > 0){
      await supabase
        .from('ayat')
        .insert({ key: req.body.key, coll_id: data[0].id })
      
    }
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
    data: {
      collections: resp,
    },
    error
  })
}