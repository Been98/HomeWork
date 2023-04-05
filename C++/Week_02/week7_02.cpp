#include <iostream>
#include <string_view>
#include <string>
#include <ctime>

using namespace std;

int value;
int ch;

string changeExt(string text)
{
    srand(time(nullptr));
    value = rand()%122+97;                               
    ch = rand()%text.size()-1;

    string str = text.data();
    char c1 = value;
    string c2;
    c2.push_back(c1);

    str = str.replace(ch, 1, c2);

    return str;
}

int main()
{
    string text;
    char str[100] = "oohello";
    cout << "string 문자열을 입력하세요 >> ";
    cin >> text;
    cout << "Original: " << text << endl;
    cout << "change: " << changeExt(text) << endl;

    cout << "cstring 문자열을 입력하세요 >> ";
    cin >> str;
    cout << "Original: " << str << endl;
    cout << "change: " << changeExt(str) << endl;
}