import { object, string, number, date } from 'yup';


console.log('Hello world')
let userSchema = object({
  name: string().required(),
  age: number().required().positive().integer(),
  email: string().email(),
  website: string().url().nullable(),
  createdOn: date().default(() => new Date()),
});

let input = document.getElementById('url-input')
console.log(input)
userSchema.validate(input)