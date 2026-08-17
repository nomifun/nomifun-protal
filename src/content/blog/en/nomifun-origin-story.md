---
title: The Story of NomiFun, an Open-Source Project
description: From a Xiaozhi AI robot and a desktop companion to NomiFun's creation, open-source rebuild, product philosophy, and the thinking behind Desktop, Mobile, Xiaozhi, and cross-platform mini apps.
publishedAt: "2026-08-15"
author: nomifun
contact: noreply@nomifun.com
lang: en-US
tags:
  - NomiFun
  - Open Source
  - Project Story
draft: false
---

In 2025, I was experimenting with the Xiaozhi AI robot. Following a tutorial, I built a small "desktop pet" of my own.

Of course, I did not want it to be just a decoration that could talk to me. Ideally, it would also control my computer, search the web, and supervise Claude Code while it worked. That led to the predecessor of NomiFun: **NomiFun Desktop**.

It was a completely local AI workstation. You could customize the desktop companion's appearance; configure its voice, vision, memory, and knowledge bases; create scheduled tasks; supervise Claude Code; connect remotely to a "Nomi" robot; and use it with the desktop client from a phone. The **server connected directly to the user's own computer** and did not need to run in the cloud. All usage data stayed local, and users could even move everything elsewhere on physical storage without losing anything.

For various reasons, this little side project did not progress much after that.

In 2026, Claude Code's coding capabilities improved dramatically, and we began using AI coding seriously throughout our own development work.

Our team had a large number of requirements to manage and feed to AI one by one. At the time, we still had to manually hand each task to Claude in sequence, which was cumbersome.

Loop-based programming designs such as `/goal` did not yet exist.

Our internal solution was to **build a requirements management platform**. We managed and subscribed to requirements through tags, then designed an intelligent multi-agent, multi-model decision system to help advance, manage, break down, schedule, and assign those requirements at runtime.

We used this system to autonomously manage the production development of a small app. Even after agent-loop workflows and `/goal` mode appeared, the approach remained useful and relevant.

Later, OpenClaw became a breakout success. Inspired by it, we upgraded our desktop companions so they could connect not only to robots but also to a variety of IM channels.

This is where NomiFun's "desktop companion" differs fundamentally from every conventional "desktop pet" on the market. It is not a decoration. It is a real agent that can work, maintain its own memory, mount multiple knowledge bases, retain unlimited conversation history, evolve its own skills, and share both memories and skills with other companions. It also has access to the full range of NomiFun platform capabilities, including computer use and browser use. Most importantly, each companion can connect to multiple IM channels, and the NomiFun platform can create and run multiple desktop companions at the same time. These ideas were highly advanced at the time, while still providing a friendly user experience.

Around then, we realized how much our friends enjoyed the product, so we began preparing to open-source NomiFun. We wanted to release a product that ran entirely on the user's own machine, was simple to deploy and use, and could support many of our forward-looking product ideas.

The first stage of the rebuild was difficult and full of setbacks:

1. The early UI was functional but unattractive, so it needed to be rebuilt.
2. The application used Electron throughout. Its large package size, high resource consumption, and garbage-collection behavior made it unsuitable for continuous operation, so we needed a different technical approach.
3. Years of redesigns had left us with considerable legacy functionality. Some backend services still ran in the cloud rather than entirely on the user's machine, including the unified requirements management platform and the unified cloud-document knowledge base. Every cloud-dependent feature had to be removed or rebuilt.

After nearly two months of work, we quietly released the project as open source during the Dragon Boat Festival on June 19, 2026. We named it **NomiFun**, or **糯米饭** in Chinese. We later withdrew that release for another round of adjustments, so the official open-source release date became June 25, 2026.

What followed is the steady stream of iterations everyone has seen. More recently, we recognized some shortcomings that had emerged during those iterations and began another foundational rebuild. As a result, current versions are not yet as stable as the 0.1.x series. Once the product reaches the stability we expect, we will move the version number to 1.x.x.

We have **no commercial ambitions for this product**, and we do not expect that to change. We simply want to make something interesting, even if it is not always the most practical tool. We understand our situation clearly: at most, only one person is responsible for developing the product, and building something both exceptionally capable and exceptionally polished is difficult. That is another reason we chose open source. We hope fresh, enthusiastic contributors will join us, build the project together, and help it become something remarkable.

By the time OpenClaw became popular, our product was already receiving strong user feedback. After version 0.0.1 launched, we received a great deal of praise even within our small private community. The features were relatively stable at the time, the product offered many innovative capabilities that were unavailable elsewhere in the industry, and the overall experience surpassed that of many commercial products.

We also owe our users an apology. The disruptive rebuild that followed caused a significant decline in stability. We will continue repairing and improving the product and will work to deliver a stable release as soon as possible.

Since then, we have introduced features such as intelligent customer service and cross-platform mini apps. We have also open-sourced several related projects, including the **mobile app**, a **Xiaozhi AI firmware adaptation**, and **network relay infrastructure**. Feel free to guess what will be next in our open-source product family.

Our open-source **mobile app** deserves a closer introduction. Its framework is not the point: React Native is not necessarily the optimal choice, but it offered a fast development path. The important part is the design that lets a phone connect directly to NomiFun Desktop.

We have always emphasized user privacy and data security. When a phone connects directly to a computer without passing through any third-party relay, both responsiveness and information security improve. This architecture also means the mobile app does not need to carry a large amount of functionality or require us to maintain extensive backend logic.

We should also introduce our **cross-platform mini apps**. The feature is currently only a preview, but it represents a forward-looking direction for agent products. We wanted to let people try it early, and we will continue refining it.

Our goal is to build **an agent that users enjoy, that can evolve on its own, and that can be migrated between environments**. Two capabilities are especially important:

1. It can create executable programs and then invoke those programs itself.
2. It can publish and distribute the programs it creates.

Many people use AI coding tools either for work or to build software of their own. Yet even with AI, the traditional software-engineering process of development, compilation, debugging, deployment, and execution is still not especially friendly to most users.

For a self-evolving agent, the ability to create and load its own tools at runtime is essential.

For users, it is equally important that what they create becomes immediately usable and can continue to be used and improved over time.

That makes the runtime environment a crucial part of the design. This is what we are working on now. The idea has something in common with Docker and the JVM: software should be loadable and executable as soon as it is added, dynamically updatable, and portable across platforms.

Because of limitations in NomiFun's current technology stack and architecture, the mini-app feature is still far from what we originally envisioned. We plan to create a separate open-source project for it so we can move the idea forward without disrupting the capabilities and interactions of NomiFun Desktop.

That is all for today. We will continue the story another time.
