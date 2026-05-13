def chatbot():
    print("🤖 Welcome to the Rule-Based AI Chatbot!")
    print("Type 'quit', 'exit', or 'bye' to end the conversation.\n")

    while True:
        user_input = input("You: ").strip().lower()

        if user_input in ['quit', 'exit', 'bye', 'goodbye']:
            print("Chatbot: Goodbye! Have a great day!")
            break
        elif user_input in ['hello', 'hi', 'hey', 'greetings']:
            print("Chatbot: Hello there! Are you an intern at DecodeLabs? (yes/no)")
            intern_status = input("You: ").strip().lower()
            if intern_status in ['yes', 'y', 'yeah']:
                print("Chatbot: That's awesome! Good luck with Project 1!")
            elif intern_status in ['no', 'n', 'nope']:
                print("Chatbot: Nice to meet you anyway! How can I help you today?")
            else:
                print("Chatbot: I'll take that as a maybe! How can I help you today?")
        elif user_input in ['how are you?', 'how are you doing?', 'how are you']:
            print("Chatbot: I'm just a rule-based AI, but I'm doing great! How about you?")
        elif user_input in ['what is your name?', 'who are you?', 'what are you?']:
            print("Chatbot: I am a simple Rule-Based AI Chatbot built for DecodeLabs Project 1.")
        elif user_input in ['what can you do?', 'help', 'capabilities']:
            print("Chatbot: I can respond to basic greetings, answer simple questions about myself, and chat with you based on predefined rules!")
        elif user_input in ['who created you?', 'creator', 'who made you?']:
            print("Chatbot: I was created by a talented intern: Anmol Verma at DecodeLabs!")
        else:
            print("Chatbot: I'm sorry, I don't understand that. Could you try rephrasing?")


if __name__ == "__main__":
    chatbot()
