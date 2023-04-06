#include <stdio.h>
#include <stdlib.h>
#include <sys/types.h>
#include <sys/socket.h>
#include <string.h>
#include <netinet/in.h>
#include <sys/stat.h>
#include <unistd.h>
#include <sys/un.h>
#include <fcntl.h>
#include <arpa/inet.h>

#define BUF_SIZE 256
#define SOCK_ADDR "./sock_addr2"

int main(int argc, char *argv[])
{
    int sock, len, sock2, len2, client;

    struct sockaddr_un server_addr;
    struct sockaddr client_addr;
    
    struct sockaddr_in addr;

    char buf[BUF_SIZE] = {0,};
    char buf2[BUF_SIZE] = {0,};

    server_addr.sun_family = AF_UNIX;
    strcpy(server_addr.sun_path, SOCK_ADDR);

    sock = socket(AF_UNIX, SOCK_STREAM, 0);
    if (sock == -1)
    {
        perror("Socket Error\n");
    }

    sock2 = socket(AF_INET, SOCK_STREAM, 0);
    if (sock2 == -1)
    {
        perror("Socket Error\n");
    }

    if (bind(sock, (struct sockaddr *)&server_addr, sizeof(server_addr)) == -1)
    {
        perror("bind");
        exit(1);
    }
    if (listen(sock, 5) == -1)
    {
        perror("listen");
        exit(1);
    }
    printf("[Info] Unix socket : waiting for conn req\n");
    client = accept(sock, &client_addr, &len);
    if(client != -1)
        printf("[Info] Unix socket : client connected\n");

    addr.sin_family = AF_INET;
    addr.sin_addr.s_addr = inet_addr("127.0.0.1");
    addr.sin_port = htons(5010);

    if (connect(sock2, (struct sockaddr *)&addr, sizeof(addr)) == -1)
    {
        perror("Connect Error\n");
        exit(1);
    }
    printf("[Info] Inet socket : connected to the server\n");
    int flags = fcntl(client, F_GETFL, 0);
    fcntl(client, F_SETFL,flags |  O_NONBLOCK); //Uinx
    flags = fcntl(sock2, F_SETFL, 0);
    fcntl(sock2,F_SETFL,flags| O_NONBLOCK); //Inet
    int a = 0;
    while(1){
        if(recv(client, buf, BUF_SIZE, 0)!= -1){
        	printf("[Me] : %s\n", buf);
	 	if (send(sock2, buf, BUF_SIZE, 0) == -1 && a == 0)
       		{
        	    perror("print Send(Inet) Error\n");
        	    exit(1);
       		}
		if(strncmp(buf, "quit", strlen("quit")) ==0 )
		{
			break;
		}
	}
        memset(buf, 0, BUF_SIZE);
        if(recv(sock2, buf2, BUF_SIZE, 0) != -1 && a ==0){
        	printf("[YOU] : %s\n", buf2);
		if (strncmp(buf2, "quit", strlen("quit")) == 0)
           	 {
			 a = 1;
               		 close(sock2);
            	}
	}
        memset(buf2,0,BUF_SIZE);
    }
    close(sock);
    close(client);
    close(sock2);
}
