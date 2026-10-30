import {validateEnquiry} from '../../../lib/enquiry';
export async function POST(req:Request){
 if(Number(req.headers.get('content-length')||0)>12000)return Response.json({message:'Request too large.'},{status:413});
 const origin=req.headers.get('origin');if(origin&&origin!==new URL(req.url).origin)return Response.json({message:'Request origin rejected.'},{status:403});
 let raw:unknown;try{const text=await req.text();if(text.length>12000)return Response.json({message:'Request too large.'},{status:413});raw=JSON.parse(text)}catch{return Response.json({message:'Invalid request.'},{status:400})}
 const result=validateEnquiry(raw);if(!result.ok)return Response.json({message:result.message},{status:400});
 if(!process.env.ENQUIRY_WEBHOOK_URL)return Response.json({message:'Demo validated successfully. No enquiry was saved or sent; delivery is not configured.',mode:'demo'});
 try{const url=new URL(process.env.ENQUIRY_WEBHOOK_URL);if(url.protocol!=='https:')throw Error('HTTPS required');const response=await fetch(url,{method:'POST',headers:{'Content-Type':'application/json',...(process.env.ENQUIRY_WEBHOOK_TOKEN?{Authorization:`Bearer ${process.env.ENQUIRY_WEBHOOK_TOKEN}`}:{})},body:JSON.stringify(result.data),signal:AbortSignal.timeout(8000),redirect:'error'});if(!response.ok)throw Error('Delivery failed');return Response.json({message:'Your enquiry was sent. We will be in touch.',mode:'sent'})}catch{return Response.json({message:'Delivery unavailable. Please try again later.'},{status:502})}
}
