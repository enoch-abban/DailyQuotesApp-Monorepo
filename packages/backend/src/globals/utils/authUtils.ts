
import * as bcrypt from 'bcryptjs';
import { MIN_OTP_LENGTH, OTP_LENGTH } from '../../config/project.config';

const authenticationUtils = (function () {
    const encryptPassword = (password: string) => {
        return new Promise(function (resolve, reject){
            bcrypt.genSalt(10).then((salt)=>{
                return bcrypt.hash(password, salt);
            }).then((hashpassword)=>{
                resolve(hashpassword);
            }).catch((err)=>{
                reject(err);
            })
        });
    };

    const decryptpassword = (hash: string, password: string)=>{
        return new Promise(function (resolve, reject){
            bcrypt.compare(password, hash).then((res)=>{
                resolve(res)
            }).catch((err)=>{
                console.log(err);
                reject({'error':'error occurred whilst processing password',
            })
            })
        })
    }

    const generateOTP = () => {
        return new Promise(function(resolve, reject){
            if (OTP_LENGTH < MIN_OTP_LENGTH) {
                reject({error: `OTP length must be > ${MIN_OTP_LENGTH}`});
            }
            const mult_by = Number("9" + "0".repeat(OTP_LENGTH-1));
            const add_by = Number("1" + "0".repeat(OTP_LENGTH-1))
            const otp = `${Math.floor(add_by + Math.random() * mult_by)}`;

            resolve(otp);

        })
    }

    return {
        encryptPassword,
        decryptpassword,
        generateOTP
    };
  })();

  export default authenticationUtils;