function compararFormularios() {
    let campos = [
        "nomeCliente",
        "dadosRecebedor",
        "cpf",
        "codigoPagarMe",
        "linkRecebedor",
        "codigoBanco",
        "nomeBanco",
        "agencia",
        "contaDv",
        "titular",
        "cpfCnpj"
    ];

    let divergencias = [];

    campos.forEach(campo => {
        let valor1 = document.getElementById(campo + "1").value;
        let valor2 = document.getElementById(campo + "2").value;

        if (valor1 !== valor2) {
            divergencias.push(`Divergência no campo ${campo}: ${valor1} ≠ ${valor2}`);
        }
    });

    let resultDiv = document.getElementById("result");
    if (divergencias.length > 0) {
        resultDiv.innerHTML = "<strong>Valores Divergentes Encontrados:</strong><br>" + divergencias.join("<br>");
        resultDiv.style.color = "red";
    } else {
        resultDiv.innerHTML = "Os formulários são idênticos.";
        resultDiv.style.color = "green";
    }
}

function verificarTarefas() {
    let tarefas = document.querySelectorAll("#taskList li");
    let resultDiv = document.getElementById("taskResult");
    let pendencias = [];

    tarefas.forEach((tarefa, index) => {
        let checkbox = tarefa.querySelector("input[type='checkbox']");
        if (!checkbox.checked) {
            pendencias.push(`Atividade ${index + 1} não realizada: ${tarefa.innerText}`);
        }
    });

    if (pendencias.length > 0) {
        resultDiv.innerHTML = "<strong>Pendências Encontradas:</strong><br>" + pendencias.join("<br>");
        resultDiv.style.color = "red";
    } else {
        resultDiv.innerHTML = "Todas as atividades foram realizadas.";
        resultDiv.style.color = "green";
    }
}
