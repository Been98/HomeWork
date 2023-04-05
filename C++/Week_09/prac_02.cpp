#include<iostream>
using namespace std;

char& find2replace(string &a, string &b,string&c, bool &d){
    int i =0;
    while(a[i]){
        if(a[i]==b[0]){
            d = true;
            a[i] = c[0];
        }
        i++;
        
    }
    if(d == true)
        return a[i];
    else
        return a[0];
}

int main()
{
    std::string str = "C++ programming";
    std::string has = "+";
    string replace = "p";
    bool result = false;

    cout << "변경 전 문자열 = " << str << endl;

    char a = find2replace(str, has, replace, result);
    if (result == true)
        cout << "변경 후 문자열 = " << str << endl;
    else
        cout << str << "에서 " << has << "를 발견하지 못함." << endl;
    return 0;
}