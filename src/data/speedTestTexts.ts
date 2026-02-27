export interface SpeedTestText {
    id: number;
    title: string;
    text: string;
    difficulty: 'easy' | 'medium' | 'hard';
}

export const speedTestTexts: SpeedTestText[] = [
    {
        id: 1,
        title: 'The Digital Age',
        difficulty: 'easy',
        text: 'Technology has changed the way we live and work. Smartphones keep us connected to friends and family around the world. With a few taps, we can shop, learn, or share our thoughts with millions of people. The internet has made information available to everyone, making the world a much smaller place.',
    },
    {
        id: 2,
        title: 'Morning Routine',
        difficulty: 'easy',
        text: 'Starting the morning with a healthy routine can set the tone for the entire day. A glass of water, some light exercise, and a nutritious breakfast give both the body and mind the energy they need. Taking a few quiet minutes to plan the day ahead can help you stay focused and productive.',
    },
    {
        id: 3,
        title: 'The Joy of Reading',
        difficulty: 'easy',
        text: 'Books open doors to worlds we could never visit in real life. Through the pages of a novel, we can travel back in time, explore distant galaxies, or step into the minds of fascinating characters. Reading not only entertains but also builds vocabulary, sharpens focus, and sparks creativity in ways few other activities can.',
    },
    {
        id: 4,
        title: 'Nature and Wellbeing',
        difficulty: 'medium',
        text: 'Spending time in nature has proven benefits for mental health. The sight of open skies, the sound of flowing water, and the smell of fresh earth can reduce stress and anxiety significantly. Studies show that even a short walk through a park can lower cortisol levels and improve mood, making regular outdoor activity an easy prescription for wellbeing.',
    },
    {
        id: 5,
        title: 'The Art of Typing',
        difficulty: 'medium',
        text: 'Touch typing is one of those rare skills that pays dividends every single day. Once your fingers learn the keyboard layout through muscle memory, you stop hunting for keys and start thinking through your fingers. Accuracy always comes before speed; a typist who types correctly at 40 WPM will surpass a careless one going 60 WPM, because corrections eat up precious time.',
    },
    {
        id: 6,
        title: 'Coffee Culture',
        difficulty: 'medium',
        text: 'Coffee is more than a beverage — it is a daily ritual for millions of people across the globe. From the dark espresso bars of Naples to the minimalist third-wave cafes of Portland, every region has developed its own coffee identity. The science of extraction, water temperature, grind size, and brewing time has turned coffee-making into a craft that rivals fine cooking in complexity.',
    },
    {
        id: 7,
        title: 'Space Exploration',
        difficulty: 'hard',
        text: 'Humanity has always looked upward with curiosity and ambition. The moon landing of 1969 remains one of the greatest achievements in human history, requiring decades of engineering ingenuity and extraordinary courage. Today, private companies are racing alongside national agencies to push the frontier further — toward Mars, the asteroid belt, and eventually the stars themselves. Each mission expands not only our scientific knowledge but also our collective sense of what is possible.',
    },
    {
        id: 8,
        title: 'Artificial Intelligence',
        difficulty: 'hard',
        text: 'Artificial intelligence is reshaping nearly every industry at a pace that challenges our ability to adapt. Machine learning algorithms can now diagnose diseases, generate art, write code, and hold conversations indistinguishable from human speech. Yet the technology raises profound questions about privacy, accountability, and the future of work. Society must grapple with how to harness its enormous potential while mitigating the very real risks it introduces.',
    },
    {
        id: 9,
        title: 'Ocean Depths',
        difficulty: 'hard',
        text: 'We know more about the surface of Mars than we do about the deep ocean floor. The crushing pressures and total darkness of the abyss hide ecosystems that defy imagination — creatures that produce their own light, survive without sunlight, and thrive on chemical energy rather than solar energy. Every deep-sea expedition returns with species never before catalogued, reminding us that the greatest frontier of discovery may lie right here on our own planet, beneath the waves.',
    },
    {
        id: 10,
        title: 'The Power of Habit',
        difficulty: 'medium',
        text: 'Habits shape the architecture of our daily lives. Research in behavioral psychology suggests that roughly forty percent of our daily actions are not conscious decisions but habitual responses to familiar cues. The good news is that habits can be deliberately engineered. By identifying the cue, routine, and reward that define any given habit loop, we gain the power to replace destructive patterns with constructive ones, gradually transforming who we are one small choice at a time.',
    },
];

export const getRandomText = (): SpeedTestText => {
    const index = Math.floor(Math.random() * speedTestTexts.length);
    return speedTestTexts[index];
};
