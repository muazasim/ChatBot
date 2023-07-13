document.addEventListener('DOMContentLoaded', function () {

  // Use buttons to toggle between views
  document.querySelector('#inbox').addEventListener('click', () => load_mailbox('inbox'));
  document.querySelector('#sent').addEventListener('click', () => load_mailbox('sent'));
  document.querySelector('#archived').addEventListener('click', () => load_mailbox('archive'));
  document.querySelector('#compose').addEventListener('click', compose_email);

  // By default, load the inbox
  load_mailbox('inbox');
});

function compose_email() {

  // Show compose view and hide other views
  document.querySelector('#emails-view').style.display = 'none';
  document.querySelector('#compose-view').style.display = 'block';
  document.querySelector('#single-view').style.display = 'none';






  // Clear out composition fields
  document.querySelector('#compose-recipients').value = '';
  document.querySelector('#compose-subject').value = '';
  document.querySelector('#compose-body').value = '';



  document.querySelector('#compose-form').addEventListener('submit', () => {
    receptent = document.querySelector('#compose-recipients').value;
    subject = document.querySelector('#compose-subject').value;
    mailbody = document.querySelector('#compose-body').value;
    fetch('/emails', {
      method: 'POST',
      body: JSON.stringify({
        recipients: receptent,
        subject: subject,
        body: mailbody
      })
    })
      .then(response => response.json())
      .then(result => {
        // Print result

        console.log(result);
        console.log('done posting mail');
      });


  })

}

function load_mailbox(mailbox) {

  // Show the mailbox and hide other views
  document.querySelector('#emails-view').style.display = 'block';
  document.querySelector('#compose-view').style.display = 'none';
  document.querySelector('#single-view').style.display = 'none';
  fetch(`/emails/${mailbox}`)
    .then(response => response.json())
    .then(emails => {
      console.log(emails)
      emails.forEach(element => {
        const sender1 = document.createElement('h6')
        sender1.className = "mailheading"
        sender1.innerHTML = `${element.sender}`
        const reciptent = document.createElement('h6')
        reciptent.innerHTML = `<b>To :</b> ${element.recipients}`
        const subject = document.createElement('h6')
        subject.innerHTML = `${element.subject}`
        const bodyhead = document.createElement('h6')
        bodyhead.innerHTML = '<b>Body : </b>'
        const body = document.createElement('p')
        body.innerHTML = element.body

        const mail_component = document.createElement('div')
        mail_component.className = 'maildiv'


        if (element.read) {
          mail_component.append(sender1, body)

        }
        else {
          const read = document.createElement('h5')
          read.innerHTML = 'new'
          read.className = 'new'
          mail_component.append(sender1, read, body)
        }

        mail_component.addEventListener('click', () => displaymail(element.id))
        document.querySelector('#emails-view').append(mail_component)

      });
    });

  // Show the mailbox name
  document.querySelector('#emails-view').innerHTML = `<h3>${mailbox.charAt(0).toUpperCase() + mailbox.slice(1)}</h3>`;


}


function displaymail(id) {
  document.querySelector('#emails-view').style.display = 'none';
  document.querySelector('#compose-view').style.display = 'none';
  document.querySelector('#single-view').style.display = 'block';

  fetch(`/emails/${id}`, {
    method: 'PUT',
    body: JSON.stringify({

      read: true
    })
  })

  fetch(`/emails/${id}`)
    .then(response => response.json())
    .then(element => {
      console.log(element)
      const sender1 = document.createElement('h6')
      sender1.className = "mailheading"
      sender1.innerHTML = `<b>From :</b> ${element.sender}`
      const reciptent = document.createElement('h6')
      reciptent.className = "mailheading"
      reciptent.innerHTML = `<b>To :</b> ${element.recipients}`
      const subject = document.createElement('h6')
      subject.innerHTML = `<b>Subject :</b> ${element.subject}`
      subject.className = "subject"
      const bodyhead = document.createElement('h6')
      bodyhead.innerHTML = '<b>Body : </b>'
      const body = document.createElement('p')
      body.innerHTML = element.body
      // const archive = document.createElement('p')
      // archive.innerHTML = `<p>${element.archived}</p>`
      const input1 = document.createElement('input')
      const input2 = document.createElement('input')
      const form1 = document.createElement('form')
      form1.id = 'form1'
      input1.value = element.id
      input2.value = element.archived
      input1.style.display = 'none';
      input2.style.display = 'none';
      const b = document.createElement('button')
      b.className = "btn btn-dark"
      b.id = 'archive'
      b.type = 'submit'

      if (element.archived) {
        b.innerHTML = '<b>Remove From Archive</b>'
      }
      else {
        b.innerHTML = '<b>Add to Archive</b>'
      }

      form1.append(input1, input2, b)
      const mail_component = document.createElement('div')
      mail_component.append(sender1, reciptent, subject, bodyhead, body)
      mail_component.className = 'maildiv'
      form1.addEventListener('click', () => Archive(element.id, element.archived))
      const mail = document.createElement('div')
      mail.append(mail_component, form1)
      document.querySelector('#single-view').append(mail)

    })
  // console.log(element.arch)

}


function Archive(id, archive_val) {
  if (archive_val) {
    fetch(`/emails/${id}`, {
      method: 'PUT',
      body: JSON.stringify({

        archived: false
      })
    })
    // console.log()
  }
  else {
    fetch(`/emails/${id}`, {
      method: 'PUT',
      body: JSON.stringify({

        archived: true
      })
    })
  }


}