Looking at the current @architecture-design.md documentation, the @repositories/ @services/ I want you to come up with a plan that creates the necessary service classes and associated tests so that a new @season.ts can be created. 
Here is the flow that you need to support:
1. User craetes a new season and will by default be defining their "health" pillar
2. Users will then set a "theme" for the upcopming season. Right now it could be "reverse diet and get stronger". A theme right now should be open text
3. A user will then set specific areas of focus for their pillar. E.g increase strength, be consistent, stick to the plan, maintain weight etc.
4. For each area of focus, a user can set specific metrics. A metric will have a baseline and a target.