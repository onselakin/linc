# Virtual Lab Syntax & Configuration

## Lab Folder Structure

```text
.
├── lab.yaml                        Includes general information about the lab and configuration for the Docker images
├── front.md                        Cover content of the lab
├── back.md                         The content shown when the user completes the lab
└── scenarios/                      Includes a separate folder for each scenario
    ├── 01-first-scenario/
    │   ├── scenario.yaml           Defines the scenario
    │   └── steps/
    │       ├── 01/
    │       │   ├── step.yaml       Includes information about the step and the environment
    │       │   ├── content.md      The content for the step
    │       │   ├── init.sh         The script that will run before the user starts working on the step
    │       │   ├── verify.sh       The script that will run after the user completes the step
    │       │   └── files/          The files that would mounted as a volume into the step container
    │       │       └── ....
    │       └── 02
    └── 02-second-scenario/
        ├── scenario.yaml
        └── steps/
            └── ....
```

| Item      | Description                                                                        |
|-----------|------------------------------------------------------------------------------------|
| lab.yaml  | Includes general information about the lab and configuration for the Docker images |
| front.md  | Cover content of the lab                                                           |
| back.md   | The content shown when the user completes the lab                                  |
| scenarios | Includes a separate folder for each scenario                                       |

## Creating Lab Content

Lab contents are created with a combination of `yaml` and `markdown` files. While the yaml files are used to configure
the features of the labs, markdown files are used to provide interactive content to the users.

```
| Property               | Description                                          |
|------------------------|------------------------------------------------------|
| version                | Version of the lab yaml file (current version: 0.1)  |
| id                     | Unique id for the lab                                |
| tags                   | Comma separated list of tags                         |
| title                  | Title of the lab                                     |
| author                 | Information about the lab author                     |
| author.name            | Name of the author                                   |
| author.photo           | Url for the avatar of the author                     |
| author.bio             | Short text about the author                          |
| author.social          | Social media links                                   |
| author.social.twitter  | Twitter handle for the author                        |
| author.social.linkedin | Linked in profile of the author                      |
| description            | Lab description                                      |
| difficulty             | Lab difficulty (easy/medium/hard)                    |
| estimatedTime          | Estimated time for completion in string (eg. 1 hour) |
| container              | Default image configuration for the lab              |
| container.image        | Image used for the containers                        |
| coverImage             | Lab image that are shown on various pages            | 
```

Sample:

```yaml
version: 0.1
id: how-to-create-content-for-linc
tags: linc, trainings
title: How to Create Great Virtual Labs
author:
  name: Onsel Akin
  photo: https://avatars.githubusercontent.com/u/10635384?s=400&u=20a123b39396bcb6a8bb7d60fbf27f114f9495e5&v=4
  bio: |
    Experienced software architect / designer with a demonstrated history of working in the computer software industry for almost two decades.
    Specialties include but not limited to ;-) ==> Domain-Driven Design, Event Storming.
    Also loves to design and develop mobile games.    
  social:
    twitter: "@onselakin"
    linkedin: onselakin
description: |
  This virtual lab teaches you how to create virtual labs for the LinC platform
difficulty: easy
estimatedTime: 3 hours
container:
  image: ubuntu:latest
coverImage: https://......
```

