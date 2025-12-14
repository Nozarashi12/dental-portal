// import pool from '@/lib/db'


// export async function PUT(req, { params }){
// try{
// const id = params.id
// const body = await req.json()
// const { title, video_url, description, learning_objectives, speaker, author_description, published_date, expiration_date, assessment_link, discussion_enabled } = body
// await pool.query('UPDATE classrooms SET title=?, video_url=?, description=?, learning_objectives=?, speaker=?, author_description=?, published_date=?, expiration_date=?, discussion_enabled=?, assessment_link=?, updated_at=CURRENT_TIMESTAMP WHERE id=?', [title, video_url, description, learning_objectives, speaker, author_description, published_date, expiration_date, discussion_enabled?1:0, assessment_link, id])
// return new Response(JSON.stringify({ success:true }), { status:200 })
// }catch(err){ console.error(err); return new Response(JSON.stringify({ error:'Server error' }), { status:500 }) }
// }


// export async function DELETE(req, { params }){
// try{ const id = params.id; await pool.query('DELETE FROM classrooms WHERE id=?', [id]); return new Response(JSON.stringify({ success:true }), { status:200 }) } catch(err){ console.error(err); return new Response(JSON.stringify({ error:'Server error' }), { status:500 }) }
// }