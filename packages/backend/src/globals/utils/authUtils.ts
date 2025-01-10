
import * as bcrypt from 'bcryptjs';

const authenticationUtils = (function () {
    const encryptPassword = (password: string) => {
        return new Promise(function (resolve, reject){
            bcrypt.genSalt(10).then((salt)=>{
                return bcrypt.hash(password, salt);
            }).then((hashpassword)=>{
                return resolve(hashpassword)
            }).catch((err)=>{
                return reject(err)
            })
        });
    };

    const decryptpassword = (hash: string, password: string)=>{
        return new Promise(function (resolve, reject){
            bcrypt.compare(password, hash).then((res)=>{
                return resolve(res)
            }).catch((err)=>{
                console.log(err);
                return reject({'error':'error occurred whilst processing password',
            })
            })
        })
    }

    return {
        encryptPassword,
        decryptpassword
    };
  })();

  export default authenticationUtils;