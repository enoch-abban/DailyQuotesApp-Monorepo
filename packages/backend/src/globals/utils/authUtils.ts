
import * as bcrypt from 'bcryptjs';
import { MIN_OPT_LENGTH, OPT_LENGTH } from '../../config/project.config';

const authenticationUtils = (function () {
    const encryptPassword = (password: string) => {
        return new Promise(function (resolve, reject){
            bcrypt.genSalt(10).then((salt)=>{
                return bcrypt.hash(password, salt);
            }).then((hashpassword)=>{
                return resolve(hashpassword);
            }).catch((err)=>{
                return reject(err);
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

    const generateOTP = () => {
        return new Promise(function(resolve, reject){
            if (OPT_LENGTH < MIN_OPT_LENGTH) {
                reject({error: `OTP length must be > ${MIN_OPT_LENGTH}`});
            }
            const mult_by = Number("9" + "0".repeat(OPT_LENGTH-1));
            const add_by = Number("1" + "0".repeat(OPT_LENGTH-1))
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