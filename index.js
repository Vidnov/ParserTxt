const fs = require('fs');
const path = require('path');

// Укажите путь к вашему текстовому файлу
const inputFilePath = path.join(__dirname, 'input.txt'); // Путь к входному файлу
const outputFilePath = path.join(__dirname, 'output.json'); // Путь к выходному файлу

fs.readFile(inputFilePath, 'utf-8', (err, data) => {
    if (err) {
        console.error('Ошибка при чтении файла:', err);
        return;
    }

    const cleanedData = data
        .replace(/\\/g, '') // Удаляем все обратные косые черты
        .replace(/n/g, ''); // Удаляем все символы n

    const results = {};
    const regex = /\{\s*"Параметр":\s*"([^"]+)",\s*"Значение":\s*"([^"]+)"\s*\}/g;
    let match;

    while ((match = regex.exec(cleanedData)) !== null) {
        const parameter = match[1]; // Значение ключа "Параметр"
        const value = match[2]; // Значение ключа "Значение"

        if (results[parameter]) {
            results[parameter].count += 1;
        } else {
            results[parameter] = { value: value, count: 1 };
        }
    }

    // Форматируем результат для записи в файл
    const formattedResults = Object.keys(results).map(key => ({
        Параметр: key,
        Значение: results[key].value,
        Количество: results[key].count
    }));

    // Записываем результат в новый файл
    fs.writeFile(outputFilePath, JSON.stringify(formattedResults, null, 2), (err) => {
        if (err) {
            console.error('Ошибка при записи файла:', err);
            return;
        }
        console.log('Файл успешно сохранен как output.json');
    });
});