'use strinct';

function some(array, expression) {
    for (var i = 0; i < array.length; i++) {
        if(expression(array[i], i, array)){
            return true;
        };
    }
    return false;
};