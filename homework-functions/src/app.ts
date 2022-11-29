
//call apply
let person =  {
    firstname : 'James',
    lastname : 'Johnson',
    hello: function(thing: string){
        console.log(`${this.firstname} ${this.lastname} says hello ${thing}`)
    }
}

person.hello('world');
person.hello.call({ firstname: 'Jim', lastname: 'Smith' }, 'world');
person.hello.apply({ firstname: 'Jim', lastname: 'Jones' }, ['guys']);

//bind
let pika = {
    firstname: 'Pika',
    lastname: 'Chu',
};

let pokemonName = function() {
    console.log(`${this.firstname} ${this.lastname} I choose you!`);
};

let pickPikachu = pokemonName.bind(pika);
let pickChari = pokemonName.bind({firstname: 'Chari', lastname: 'Zard'});
pickPikachu();
pickChari();



function multiplication(a: number,b: number){
    console.log(a*b);
}
let multiby2 = multiplication.bind(this,2);
let getSixAlways = multiplication.bind(this,3,2);
multiby2(3);
multiby2(4);
getSixAlways();



const calc = {
    multiply: function (a: number, b: number) { return a * b; },
    multiplyMany:
      function (...args: number[]) { return [].reduce.call(args, this.multiply)}
};

const multiplyManyBySix = calc.multiplyMany.bind(calc, 1 , 2, 3);

console.log(multiplyManyBySix(4,5));