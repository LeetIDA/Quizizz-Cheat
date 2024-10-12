async function fetchQuizAnswers(quizCode) {
    const url = "https://v3.schoolcheats.net/quizizz/answers";
    const headers = {
        "accept": "application/json, text/plain, */*",
        "accept-language": "en-US,en;q=0.9",
        "content-type": "application/json",
        "priority": "u=1, i",
        "sec-ch-ua": "\"Google Chrome\";v=\"129\", \"Not=A?Brand\";v=\"8\", \"Chromium\";v=\"129\"",
        "sec-ch-ua-mobile": "?0",
        "sec-ch-ua-platform": "\"Windows\"",
        "sec-fetch-dest": "empty",
        "sec-fetch-mode": "cors",
        "sec-fetch-site": "same-site"
    };
    const data = { input: quizCode };

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: headers,
            body: JSON.stringify(data)
        });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error("Error occurred:", error);
        return null;
    }
}

function cleanHtml(rawHtml) {
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = rawHtml;
    return tempDiv.textContent || tempDiv.innerText || "";
}

function displayAnswers(quizData) {
    if (!quizData) {
        console.error("Error: No quiz data received.");
        return;
    }

    if (quizData.error) {
        console.error(`Error from API: ${quizData.message || 'Unknown error'}`);
        return;
    }

    if (!quizData.questions) {
        console.error("Error: No questions found in the quiz data.");
        return;
    }

    const tableData = quizData.questions.map(questionData => {
        const questionText = cleanHtml(questionData.structure.query.text);

        let answerText;
        if (questionData.structure.kind === 'MCQ') {
            const correctAnswerIndex = questionData.structure.answer;
            answerText = cleanHtml(questionData.structure.options[correctAnswerIndex].text);
        } else {
            answerText = questionData.structure.answer ? questionData.structure.answer.join(', ') : 'No Answer Provided';
        }

        return { "Question": questionText, "Answer": answerText };
    });

    console.table(tableData);
}

async function main() {
    const quizCode = prompt("Enter the quiz code:");
    const quizData = await fetchQuizAnswers(quizCode);
    displayAnswers(quizData);
}

main();
