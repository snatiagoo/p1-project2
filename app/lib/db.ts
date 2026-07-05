import { neon } from "@neondatabase/serverless";
const sql = neon(`${process.env.DATABASE_URL}`);


export async function createPurchase(id: string, client_id: string, amount: number){
  //console.log("Hello_2")

  //DROP tablename to delete and then recreate if you want to change anything of an empty table

  // this is the easy defautl pattern, INSERT INTO tablename (col1, col2, col3) VALUES (${col1_val}, ...)
  await sql`
  INSERT INTO purchases (session_id, userid, amount) 
  VALUES(${id}, ${client_id}, ${amount})
  `

}