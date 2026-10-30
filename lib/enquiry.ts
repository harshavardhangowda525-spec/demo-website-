export function validateEnquiry(raw:unknown){
 const fail=(message:string)=>({ok:false as const,message});
 if(!raw||typeof raw!=='object'||Array.isArray(raw))return fail('Invalid request.');
 const value=raw as Record<string,unknown>;
 const read=(key:string,max:number)=>typeof value[key]==='string'?(value[key] as string).trim().slice(0,max+1):'';
 const name=read('name',100),email=read('email',254),phone=read('phone',20),message=read('message',2000),membership=read('membership',10),program=read('program',40);
 if(value.website)return fail('Unable to accept this request.');
 if(name.length<2||name.length>100)return fail('Please enter your full name.');
 if(email.length>254||!/^\S+@\S+\.\S+$/.test(email))return fail('Please enter a valid email.');
 if(!/^\+?[0-9 ()-]{8,20}$/.test(phone)||phone.replace(/\D/g,'').length<8)return fail('Please enter a valid phone number.');
 if(!['BASIC','PRO','ELITE'].includes(membership))return fail('Select a membership.');
 if(!['Strength training','Cardio','Personal training','Functional fitness'].includes(program))return fail('Select a training program.');
 if(message.length>2000)return fail('Message must be 2,000 characters or fewer.');
 if(value.consent!=='yes')return fail('Please consent to being contacted.');
 return {ok:true as const,data:{name,email,phone,membership,program,message,consent:true,source:'iron-pulse-website'}};
}
