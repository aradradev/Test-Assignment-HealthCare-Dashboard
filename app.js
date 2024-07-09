
document.addEventListener('DOMContentLoaded', () => {
    const apiUrl = 'https://fedskillstest.coalitiontechnologies.workers.dev'
    const username = 'coalition'
    const password = 'skills-test'

    // Creating an utility function for Base64 Encode
    const base64Encode = (str) => {
        const utf8Bytes = new TextEncoder().encode(str)
        let binaryStr = ''
        utf8Bytes.forEach(byte => binaryStr += String.fromCharCode(byte))
        return window.btoa(binaryStr)
    }

    // Encode the credentials
    const encodeCredentials = base64Encode(`${username}:${password}`)

    // fetch patient date
    fetch(apiUrl, {
        method: 'GET',
        headers: {
            'Authorization': `Basic ${encodeCredentials}`
        },
    })
    .then(resp => resp.json())
    .then(data => {
        if (data.length > 0) {
            const patientData = data[3];
            updatePatientList(patientData)
            updatePatientDetails(patientData)
            updateDiagnosisHistory(patientData)
            updateDiagnosisList(patientData)
            updateLabResult(patientData)
            initChart(patientData.diagnosis_history)
        }
    })
    .catch(e => {
        console.error(`Error fetching the data: ${e}`)
    })

    function updatePatientList(patient) {
        const patientList = document.getElementById('patient-list')
        const patientTemplate = document.getElementById('patient-template')
        const patientClone = patientTemplate.cloneNode(true)

        patientClone.style.display = 'flex'
        patientClone.querySelector('.patient-img').src = patient.profile_picture
        patientClone.querySelector('.patient-name').textContent = patient.name
        patientClone.querySelector('.patient-status').textContent = `${patient.gender}, ${patient.age}`
        patientList.appendChild(patientClone)
    }

    function updatePatientDetails(patient) {
        document.getElementById('patient-image').src = patient.profile_picture
        document.getElementById('patient-name').textContent = patient.name
        document.getElementById('date-of-birth').textContent = patient.date_of_birth
        document.getElementById('gender').textContent = patient.gender
        document.getElementById('phone-number').textContent = patient.phone_number
        document.getElementById('emergency-contact').textContent = patient.emergency_contact
        document.getElementById('insurance-type').textContent = patient.insurance_type
    }

    function updateDiagnosisHistory(patient) {
        const latestDiagnosis = patient.diagnosis_history[3]
        document.getElementById('respiratory-rate').textContent = `${latestDiagnosis.respiratory_rate.value} bpm`
        document.getElementById('respiratory-status').textContent = `${latestDiagnosis.respiratory_rate.levels}`
        document.getElementById('temperature').textContent = `${latestDiagnosis.temperature.value} bpm`
        document.getElementById('temperature-status').textContent = `${latestDiagnosis.temperature.levels}`
        document.getElementById('heart-rate').textContent = `${latestDiagnosis.heart_rate.value} bpm`
        document.getElementById('heart-status').textContent = `${latestDiagnosis.heart_rate.levels}`
    }

    function updateDiagnosisList(patient) {
        const diagnosisList = document.getElementById('diagnosis-list')
        patient.diagnostic_list.forEach(diagnosis => {
            const row = document.createElement('tr')
            row.innerHTML = `
                <td>${diagnosis.name}</td>
                <td>${diagnosis.description}</td>
                <td>${diagnosis.status}</td>
            `
            diagnosisList.appendChild(row)
        })
    }

    function updateLabResult(patient) {
        const labResultList = document.getElementById('lab-results')
        patient.lab_results.forEach(result => {
            const resultDiv = document.createElement('div')
            resultDiv.className = 'lab-desc'
            resultDiv.innerHTML = `
                <p>${result}</p>
                <img src= 'images/download_FILL0_wght300_GRAD0_opsz24 (1).svg' alt='downloader' />
            `
            labResultList.appendChild(resultDiv)
        })
    }
})

function initChart(diagnosisHistory) {
    const ctx = document.getElementById('patient-chart').getContext('2d')
    const labels = diagnosisHistory.map(entry => `${entry.month} ${entry.year}`)
    const systolic = diagnosisHistory.map(entry => entry.blood_pressure.systolic.value) 
    const diastolic = diagnosisHistory.map(entry => entry.blood_pressure.diastolic.value) 
    const heartRate = diagnosisHistory.map(entry => entry.heart_rate.value) 
    const respiratoryRate = diagnosisHistory.map(entry => entry.respiratory_rate.value) 
    const temperature = diagnosisHistory.map(entry => entry.temperature.value)
    
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [
                {
                    label: 'Systolic Blood Pressure',
                    data: systolic,
                    borderColor: 'rgba(255, 99, 132, 1)',
                    backgroundColor: 'rgba(255, 99, 132, 0.2)',
                    fill: false
                },
                {
                    label: 'Diastolic Blood Pressure',
                    data: diastolic,
                    borderColor: 'rgba(54, 162, 235, 1)',
                    backgroundColor: 'rgba(54, 162, 235, 0.2)',
                    fill: false
                },
                {
                    label: 'Heart Rate',
                    data: heartRate,
                    borderColor: 'rgba(75, 192, 192, 1)',
                    backgroundColor: 'rgba(75, 192, 192, 0.2)',
                    fill: false
                },
                {
                    label: 'Respiratory Rate',
                    data: respiratoryRate,
                    borderColor: 'rgba(153, 102, 255, 1)',
                    backgroundColor: 'rgba(153, 102, 255, 0.2)',
                    fill: false
                },
                {
                    label: 'Temperature',
                    data: temperature,
                    borderColor: 'rgba(255, 159, 64, 1)',
                    backgroundColor: 'rgba(255, 159, 64, 0.2)',
                    fill: false
                }
            ]
        },
        options: {
            responsive: true,
            title: {
                display: true,
                text: 'Diagnosis History'
            },
            tooltips: {
                mode: 'index',
                intersect: false,
            },
            hover: {
                mode: 'nearest',
                intersect: true
            },
            scales: {
                xAxes: [{
                    display:true,
                    scaleLabel: {
                        display: true,
                        labelString: 'Date'
                    }
                }],
                yAxes: [{
                    display:true,
                    scaleLabel: {
                        display: true,
                        labelString: 'Values'
                    }
                }],
            }
        }
    })
}