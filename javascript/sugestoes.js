// Inicialize o EmailJS com o userID
(function(){
    emailjs.init("william"); // Substitua YOUR_USER_ID pelo seu ID de usuário do EmailJS
})();

document.getElementById('sugestaoForm').addEventListener('submit', function(event) {
    event.preventDefault();

    var nome = document.getElementById('nome').value;
    var email = document.getElementById('email').value;
    var sugestao = document.getElementById('sugestao').value;

    // Enviar e-mail usando EmailJS
    emailjs.send("service_qnr33qp", "template_ddl0n5w", {
        nome: nome,
        email: email,
        sugestao: sugestao
    }).then(function(response) {
        alert("Sugestão enviada com sucesso!");
    }, function(error) {
        alert("Erro ao enviar sugestão. Por favor, tente novamente.");
        console.error("Erro ao enviar e-mail: ", error);
    });
});
