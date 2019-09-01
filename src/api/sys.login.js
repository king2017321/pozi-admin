import request from '@/plugin/axios'

export function AccountLogin (data) {
  let {username,password} =data;
  return new Promise((res,rej)=>{
    setTimeout(() => {
      if(username=='admin'&&password=='123456'){
        res({uuid:'admin',token:password,name:username})
      }else{
        rej('用户名或密码错误')
      }
    }, 1000);
  })
  
};
let basurl=process.env.NODE_ENV=="development"?'/wx':"https://api.weixin.qq.com"
export const getToken=()=>{
  return request({
      url:`${basurl}/cgi-bin/token?grant_type=client_credential&appid=wx77b72750d6dd14e5&secret=f3139fb838c3bb76ed05758b5e2e294e`
  })
};
export const getUser=(data)=>{
  return request({
      url:`${basurl}/tcb/invokecloudfunction?access_token=${data}&env=fayuandi-v1&name=getUser`
  })
}
