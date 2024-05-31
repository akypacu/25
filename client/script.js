const req1 = document.querySelector('.req1GET')
const req2 = document.querySelector('.req2POST')
const req3 = document.querySelector('.req3DEL')
const req4 = document.querySelector('.req4PATCH')
const responses = document.querySelector('.users-block')

//! GET
const getData = url => {
    return new Promise((resolve, reject) =>
        fetch(url)
            .then(response => response.json())
            .then(json => resolve(json))
            .catch(error => reject(error))
    )
}

//! POST
const postData = (url, data) => {
    return new Promise((resolve, reject) =>
        fetch(url, {
            method: 'POST',
            body: JSON.stringify(data),
            headers: { 'Content-type': 'application/json; charset=UTF-8' }
        })
            .then(response => response.json())
            .then(json => resolve(json))
            .catch(error => reject(error))
    )
}

//! DELETE
const deleteData = url => {
    return new Promise((resolve, reject) =>
        fetch(`${url}`, {
            method: 'DELETE'
        })
            .then(response => {
                if (response.ok) {
                    resolve('Данные успешно удалены')
                } else {
                    reject('Ошибка удаления данных')
                }
            })
            .catch(error => reject(error))
    )
}

//! PATCH
const patchData = (url, updatedData) => {
    return new Promise((resolve, reject) =>
        fetch(`${url}`, {
            method: 'PATCH',
            body: JSON.stringify(updatedData),
            headers: { 'Content-type': 'application/json; charset=UTF-8' }
        })
            .then(response => response.json())
            .then(json => resolve(json))
            .catch(error => reject(error))
    )
}

req1.addEventListener('click', async () => {
    try {
        const products = await getData('http://localhost:3002/getUsers')
        console.log(products)
        console.log(products.products)
        console.log(responses)
        responses.innerHTML = ''; // Очищаем предыдущие результаты
        products.products.forEach(el => {
            responses.insertAdjacentHTML('beforeend', 
                `<li> Название: ${el.name}, Цена: ${el.price}$, ID: ${el._id}</li>`
            )
        })
    } catch (err) {
        console.error('Произошла ошибка при получении пользователей', err)
    }
});

req2.addEventListener('click', async () => {
    let name = prompt('Введите имя')
    let price = prompt('Введите цену')

    try {
        let product = {
            name,
            price
        }
        console.log(product)
        let info = await postData('http://localhost:3002/addUsers', product)
        console.log(info)
    } catch (err) {
        console.error('Произошла ошибка при добавлении нового пользователя', err)
    }
})

req3.addEventListener('click', async () => {
    let name = prompt('Введите имя товара для удаления')
    try {
        const products = await getData('http://localhost:3002/getUsers')
        const productToDelete = products.products.find(product => product.name === name)
        if (productToDelete) {
            let info = await deleteData(`http://localhost:3002/deleteUser/${productToDelete._id}`)
            console.log(info)  // Добавлено логирование результата удаления
        } else {
            console.error('Товар с таким именем не найден')
        }
    } catch (err) {
        console.error('Произошла ошибка при удалении пользователя', err)
    }
})

req4.addEventListener('click', async () => {
    try {
        let name = prompt('Введите имя, по которому ищем')
        let newName = prompt('Введите новое имя')
        let newPrice = prompt('Введите новую цену')
        let user = {
            name: newName,
            price: newPrice
        }

        let info = await patchData(`http://localhost:3002/editUser/${name}`, user)
        console.log(info)
    } catch (err) {
        console.error('Произошла ошибка при редактировании пользователя', err)
    }
})
