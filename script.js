document.addEventListener('DOMContentLoaded', () => {
    // --- Navigation Logic ---
    const navBtns = document.querySelectorAll('.nav-btn');
    const sections = document.querySelectorAll('.module-section');

    navBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active classes
            navBtns.forEach(b => b.classList.remove('active'));
            sections.forEach(s => s.classList.remove('active-section'));
            
            // Add active class
            btn.classList.add('active');
            const targetId = btn.getAttribute('data-target');
            document.getElementById(targetId).classList.add('active-section');
        });
    });

    // --- Accordion Logic ---
    const navDetails = document.querySelectorAll('.nav-details');
    navDetails.forEach(targetDetail => {
        targetDetail.addEventListener('toggle', () => {
            if (targetDetail.open) {
                navDetails.forEach(detail => {
                    if (detail !== targetDetail) {
                        detail.removeAttribute('open');
                    }
                });
            }
        });
    });

    // --- Obsolete Module 1 & 2 Interactive Code Removed ---
    // The previous interactive switchboards and pipelines were replaced
    // by static cheatsheet layouts.


    // --- AI Evaluator ---
    const btnEvaluate = document.getElementById('btn-evaluate');
    const submissionText = document.getElementById('design-submission');
    const resultArea = document.getElementById('evaluation-result');
    const questionArea = document.getElementById('question-area');
    const aiQuestionText = document.getElementById('ai-question-text');
    
    const btnTopicMicro = document.getElementById('btn-topic-microservices');
    const btnTopicTesting = document.getElementById('btn-topic-testing');
    
    let currentTopic = "";

    const questions = {
        microservices: [
            "<strong>Scenario:</strong><br>You are the Lead Systems Architect for a major logistics enterprise that operates a large Parcel Sorting Hub. The company currently uses a single monolithic system where the User Authentication Service, the Barcode Scanning Service, and the Inventory Update Database all run on a single synchronous network flow. During peak festival seasons, barcode scanning traffic surges by 900%. Because all services share the same flow, this surge creates a massive database bottleneck. When the scanning service lags, the login system freezes entirely, preventing campus administrators and warehouse staff from accessing the system to pick up or sort parcels.<br><br><strong>Your Tasks:</strong><br>1. Architectural Migration: Apply your knowledge of Microservices-based integration to explain how you would break down this monolithic system to prevent a failure in barcode scanning from crashing the login service.<br>2. Middleware Selection & Justification: Select an appropriate middleware platform or framework from your syllabus (e.g., API Gateway, RabbitMQ, or Apache Kafka) to manage the intense real-time barcode scanning data traffic. Justify your choice by explaining its core function (such as buffering or rate-limiting).<br>3. Data Transformation Strategy: The legacy inventory database handles data using old structured objects, but your new microservices communicate via lightweight JSON format. Demonstrate how you would use a core middleware function to ensure these incompatible systems exchange information seamlessly.",
            "<strong>Scenario:</strong><br>You are the architect for a global streaming service. The system uses a monolithic database for all user profiles, billing, and video metadata. On the night of a highly anticipated movie release, millions of users log in simultaneously. The single database locks up while trying to read video metadata and update billing concurrently, causing the entire platform to crash with 'Database Timeout' errors.<br><br><strong>Your Tasks:</strong><br>1. Architectural Migration: Explain how you would decouple the profile, billing, and metadata services into independent microservices with isolated data ownership.<br>2. Middleware Selection: Select an API Gateway or Service Mesh to handle the massive influx of user requests and explain its core function (e.g., routing, caching, or rate-limiting).<br>3. Observability Strategy: With multiple new independent services, diagnosing errors becomes difficult. Suggest a tool (like ELK or Prometheus) and explain how it prevents observability overhead."
        ],
        testing: [
            "<strong>Scenario:</strong><br>You are the Systems QA Engineer for an online student parcel collection center platform called ParcelHub. The system experiences an extreme 900% surge in traffic over a 2-hour window on Friday afternoons when courier trucks drop off weekly deliveries and students flood the portal to locate their packages. During this peak window, users report that the system lags terribly, and clicking 'Find my Parcel' takes up to 10 seconds to load. Curiously, the server team reports that the main application server's CPU usage stays remarkably low (under 15%), but the system Error Rate spikes to 35%, showing multiple 500 Internal Server Error messages to users.<br><br><strong>Your Tasks:</strong><br>1. Test Design & Tool Selection: Choose an appropriate testing type and an industry tool from your syllabus to simulate this 900% traffic surge in a staging environment before the next delivery cycle. Justify your tool choice.<br>2. Performance Approach Selection: Identify which specific performance test approach (e.g., Load, Stress, Endurance, or Scalability testing) you would use to push this system past its normal operational limits to find its absolute breaking point.<br>3. Metric Analysis & Root Cause Diagnosis: Analyze the three conflicting metrics provided in the scenario (Low CPU usage + 10-second slow response time + High 35% error rate) together. Apply the metric combination rules from your slides to diagnose the most likely root cause of this failure.",
            "<strong>Scenario:</strong><br>You are the QA Lead for a major e-commerce platform preparing for a 'Black Friday' mega-sale. The system has been tested up to 10,000 concurrent users without issues. However, the marketing team just announced a viral campaign that is projected to bring 50,000 concurrent users at exactly midnight.<br><br><strong>Your Tasks:</strong><br>1. Test Design & Tool Selection: Choose an industry tool to simulate this specific 50,000 concurrent user surge and explain why it is suited for high-load simulation.<br>2. Performance Approach Selection: Identify which specific performance test approach (e.g., Stress Testing or Scalability Testing) you must run to see if the system can physically survive this 500% increase beyond normal limits. Justify your choice.<br>3. Chaos Engineering: Explain how you would use Chaos Engineering tools (like Chaos Monkey) on the payment service during testing to ensure the cart doesn't crash if the payment gateway times out."
        ]
    };

    function loadQuestion(topic) {
        currentTopic = topic;
        const qList = questions[topic];
        const randomQ = qList[Math.floor(Math.random() * qList.length)];
        aiQuestionText.innerHTML = randomQ;
        questionArea.classList.remove('hidden');
        resultArea.classList.add('hidden');
        submissionText.value = '';
        
        btnTopicMicro.style.borderColor = topic === 'microservices' ? 'var(--primary)' : 'transparent';
        btnTopicTesting.style.borderColor = topic === 'testing' ? 'var(--primary)' : 'transparent';
        btnTopicMicro.style.background = topic === 'microservices' ? 'rgba(143, 170, 221, 0.2)' : '';
        btnTopicTesting.style.background = topic === 'testing' ? 'rgba(143, 170, 221, 0.2)' : '';
    }

    btnTopicMicro.addEventListener('click', () => loadQuestion('microservices'));
    btnTopicTesting.addEventListener('click', () => loadQuestion('testing'));

    const btnRefreshQ = document.getElementById('btn-refresh-q');
    if (btnRefreshQ) {
        btnRefreshQ.addEventListener('click', () => {
            if (currentTopic) loadQuestion(currentTopic);
        });
    }

    const GEMINI_API_KEY = "AIzaSyC7gs_y4DqsqDySHT7G2eXOEmiQw7DCJk0";

    async function evaluateWithGemini(topic, question, answer) {
        const prompt = `You are an AI Architectural Evaluator. 
The student was given this case study: "${question}"
The student provided this answer: "${answer}"

Evaluate the answer based on three strict criteria:
C1 (Knowledge): Did the student identify a correct, relevant industry tool, framework, or technology by name?
C2 (Comprehension): Did the student explain how the selected technology or pattern works (e.g., its mechanism)?
C3 (Application): Did the student successfully apply the theory/tool to solve the unique bottleneck or problem described in the scenario?

Return a JSON object EXACTLY in this format, with no markdown formatting around it:
{
    "c1_pass": true,
    "c2_pass": false,
    "c3_pass": false,
    "feedback": "A short, encouraging 2-3 sentence feedback explaining the score."
}`;

        const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`;
        const data = {
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: { responseMimeType: "application/json" }
        };

        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });

        if (!response.ok) {
            const errText = await response.text();
            throw new Error(`API Error ${response.status}: ${errText}`);
        }
        const json = await response.json();
        let text = json.candidates[0].content.parts[0].text;
        text = text.replace(/```json/g, '').replace(/```/g, '').trim();
        return JSON.parse(text);
    }

    btnEvaluate.addEventListener('click', async () => {
        const text = submissionText.value;
        if (text.trim().length < 15) {
            alert("Please provide a more detailed architectural design before submitting.");
            return;
        }

        btnEvaluate.innerText = "Analyzing with Gemini AI...";
        btnEvaluate.disabled = true;
        resultArea.classList.add('hidden');
        
        try {
            const currentQ = aiQuestionText.innerText; // Get clean text without HTML tags for the prompt
            let evalResult;
            
            try {
                evalResult = await evaluateWithGemini(currentTopic, currentQ, text);
            } catch (apiError) {
                console.warn("Gemini API Error, falling back to offline evaluator:", apiError);
                
                // Fallback Offline Evaluator
                let hasC1 = false, hasC2 = false, hasC3 = false;
                if (currentTopic === 'microservices') {
                    hasC1 = /(rabbitmq|kafka|gateway|middleware|message broker|esb)/i.test(text);
                    hasC2 = /(buffer|rate-limit|asynchronous|translate|transform|json|decouple|queue|route)/i.test(text);
                    hasC3 = /(prevent|crash|freeze|bottleneck|isolate|separate|independent|seamless)/i.test(text);
                } else {
                    hasC1 = /(jmeter|loadrunner|gatling|locust|stress test|load test)/i.test(text);
                    hasC2 = /(simulate|push|limit|breaking point|surge|heavy|beyond)/i.test(text);
                    hasC3 = /(database|network|bottleneck|elsewhere|slow query|not cpu|backend|db)/i.test(text);
                }
                
                let fbText = "";
                let tempScore = (hasC1 ? 1 : 0) + (hasC2 ? 1 : 0) + (hasC3 ? 1 : 0);
                if (tempScore === 3) fbText = "C3 Level Achieved! Excellent design. You correctly identified the tool, explained its mechanism, and applied it to solve the bottleneck.";
                else if (tempScore >= 1 && !hasC3) fbText = "C1/C2 Level Achieved. Good theory, but aim for C3 application.";
                else fbText = "Insufficient answer. Ensure you name the tool, explain it, and apply it.";
                
                evalResult = {
                    c1_pass: hasC1,
                    c2_pass: hasC2,
                    c3_pass: hasC3,
                    feedback: "⚠️ (Offline Fallback Mode due to AI Rate Limit) - " + fbText
                };
            }
            
            resultArea.classList.remove('hidden');
            btnEvaluate.innerText = "Submit for AI Evaluation";
            btnEvaluate.disabled = false;
            
            updateCriterion('crit-c1', evalResult.c1_pass);
            updateCriterion('crit-c2', evalResult.c2_pass);
            updateCriterion('crit-c3', evalResult.c3_pass);
            
            let score = 0;
            if(evalResult.c1_pass) score++;
            if(evalResult.c2_pass) score++;
            if(evalResult.c3_pass) score++;
            
            const finalMark = document.getElementById('final-mark');
            if (finalMark) {
                finalMark.innerText = `Score: ${score}/3`;
                if (score === 3) finalMark.style.background = 'var(--accent)';
                else if (score >= 1 && !evalResult.c3_pass) finalMark.style.background = 'var(--secondary)';
                else finalMark.style.background = 'var(--warning)';
            }
            
            const feedbackText = document.getElementById('feedback-text');
            feedbackText.innerText = evalResult.feedback;
            
            if (score === 3) {
                feedbackText.style.color = 'var(--accent)';
            } else if (score >= 1 && !evalResult.c3_pass) {
                feedbackText.style.color = 'var(--secondary)'; // pastel purple
            } else {
                feedbackText.style.color = 'var(--warning)';
            }
            
            resultArea.scrollIntoView({ behavior: 'smooth' });
            
        } catch (error) {
            console.error("Critical Failure:", error);
            alert("System Error: " + error.message);
            btnEvaluate.innerText = "Submit for AI Evaluation";
            btnEvaluate.disabled = false;
        }
    });

    function updateCriterion(id, passed) {
        const el = document.getElementById(id);
        if (el) {
            el.className = 'criterion ' + (passed ? 'pass' : 'fail');
        }
    }

    // --- Theme Toggle ---
    const themeBtn = document.getElementById('theme-toggle');
    themeBtn.addEventListener('click', () => {
        document.body.classList.toggle('dark-mode');
        
        const isDark = document.body.classList.contains('dark-mode');
        themeBtn.innerHTML = isDark ? '☀️ Light Mode' : '🌙 Dark Mode';
        
        // Update chart colors dynamically
        const textColor = isDark ? '#94a3b8' : '#718096';
        const gridColor = isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)';
        
        metricsChart.options.plugins.legend.labels.color = textColor;
        metricsChart.options.scales.x.ticks.color = textColor;
        metricsChart.options.scales.x.grid.color = gridColor;
        metricsChart.options.scales.y.grid.color = gridColor;
        
        metricsChart.update();
    });
});
